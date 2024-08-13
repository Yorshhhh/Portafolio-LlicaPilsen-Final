from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from django.core.mail import EmailMessage
from .models import Usuario
import logging
from rest_framework.response import Response
import os

import threading
from django.core.mail import EmailMessage

class EmailThread(threading.Thread):
    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)

    def run(self):
        self.email.send()

class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(
            subject=data['email_subject'], body=data['email_body'], to=[data['to_email']]
        )
        EmailThread(email).start()
    
    @staticmethod
    def send_bulk_email(email_subject, email_body):
        print(f"Enviando correo con asunto: {email_subject} y cuerpo: {email_body}")  # Para ver qué se envía
        usuarios_validados = Usuario.objects.filter(is_verified=True).values_list('correo', flat=True)

        print(f"Usuarios validados: {list(usuarios_validados)}")  # Verifica los correos a los que se envía

        for email in usuarios_validados:
            email_message = EmailMessage(
            subject=email_subject,
            body=email_body,
            to=[email],
        )
            EmailThread(email_message).start()

logger = logging.getLogger(__name__)

def generate_pdf(pedido, usuario, detalles_pedido, comuna, ciudad, region, empresa=None):
    try:
        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)

        # Información de la empresa vendedora (LlicaPilsen SpA)
        c.drawString(100, 780, "LlicaPilsen SpA")
        c.drawString(100, 765, "80.888.764-3")
        c.drawString(100, 750, "Fabricación y comercialización de cervezas artesanales")
        c.drawString(100, 735, "Avenida Costanera #2826 Lagunillas 2")
        c.drawString(100, 720, "Coronel, Concepción")
        c.drawString(100, 705, "jsalasc95@gmail.com")
        c.drawString(100, 690, "84089279")

        # Línea separadora
        c.line(100, 675, 500, 675)

        # Información del pedido
        c.drawString(100, 655, f"Pedido Número: {pedido.cod_pedido}")
        c.drawString(100, 640, f"Fecha del Pedido: {pedido.fecha_pedido.strftime('%d-%m-%Y')}")
        c.drawString(100, 625, f"Tipo de Documento: {pedido.tipo_documento}")
        c.drawString(100, 610, f"Tipo de Entrega: {pedido.tipo_entrega}")
        c.drawString(100, 595, f"Nombre del Cliente: {usuario.nombres} {usuario.apellidos}")
        c.drawString(100, 580, f"Correo: {usuario.correo}")
        c.drawString(100, 565, f"Dirección: {usuario.direccion}")
        c.drawString(100, 550, f"Comuna: {comuna.nombre if comuna else 'N/A'}")
        c.drawString(100, 535, f"Ciudad: {ciudad.nombre if ciudad else 'N/A'}")
        c.drawString(100, 520, f"Región: {region.nombre if region else 'N/A'}")

        # Si se incluye una factura, añadir la información de la empresa del cliente
        if pedido.tipo_documento == 'factura' and empresa:
            c.line(100, 510, 500, 510)
            c.drawString(100, 490, "Información de la Empresa del Cliente:")
            c.drawString(100, 475, f"Razón Social: {empresa.razon_social}")
            c.drawString(100, 460, f"RUT Empresa: {empresa.rut_empresa}")
            c.drawString(100, 445, f"Giro Comercial: {empresa.giro_comercial}")
            c.drawString(100, 430, f"Dirección: {empresa.direccion_empresa}, {empresa.numero_empresa}")
            c.drawString(100, 415, f"Comuna: {empresa.comuna_empresa.nombre if empresa.comuna_empresa else 'N/A'}")
            c.drawString(100, 400, f"Ciudad: {empresa.ciudad_empresa.nombre if empresa.ciudad_empresa else 'N/A'}")
            c.drawString(100, 385, f"Región: {empresa.region_empresa.nombre if empresa.region_empresa else 'N/A'}")

        # Línea separadora antes de los detalles del pedido
        c.line(100, 375, 500, 375)

        # Detalles del pedido
        y = 360
        for detalle in detalles_pedido:
            # Nombre del producto con ajuste de longitud para evitar sobreposiciones
            nombre_producto = detalle.cod_producto.nombre_producto
            max_len_producto = 35  # Puedes ajustar este valor según sea necesario
            
            # Truncar el nombre del producto si es necesario
            if len(nombre_producto) > max_len_producto:
                nombre_producto = nombre_producto[:max_len_producto - 3] + '...'
    
            # Colocar las columnas en posiciones fijas
            c.drawString(100, y, nombre_producto)
            c.drawRightString(300, y, str(detalle.cantidad))
            c.drawRightString(500, y, f"${detalle.precio_unitario}")
    
            y -= 15

        # Línea antes de totales
        c.line(100, y + 10, 500, y + 10)  

        # Totales, IVA y costos adicionales
        c.drawString(100, y - 20, f"Total Neto: ${pedido.total_neto}")
        c.drawString(100, y - 35, f"IVA: ${pedido.iva}")
        c.drawString(100, y - 50, f"Costo de Envío: ${pedido.costo_envio}")
        c.drawString(100, y - 65, f"Total Boleta: ${pedido.total_boleta}")

        c.save()
        buffer.seek(0)

        # Guardar el PDF para verificación (ruta puede variar según tu entorno)
        pdf_path = f'C:/Users/Yorshhh/Documents/Polo/pedido_confirmacion_{pedido.cod_pedido}.pdf'
        with open(pdf_path, 'wb') as f:
            f.write(buffer.getvalue())
        logger.info("PDF generado correctamente y guardado en %s", pdf_path)

        return buffer.getvalue()
    except Exception as e:
        logger.error("Error generando PDF: %s", str(e))
        return Response({'status': 'error generando PDF'}, status=500)


def send_email_with_pdf(usuario, pdf_content):
    try:
        email = EmailMessage(
            subject='Confirmación de Pedido',
            body='Adjunto encontrarás la confirmación de tu pedido.',
            from_email='seinagi77@gmail.com',
            to=[usuario.correo],
        )
        email.attach('confirmacion_pedido.pdf', pdf_content, 'application/pdf')
        email.send()
        logger.info("Correo enviado a %s", usuario.correo)
    except Exception as e:
        logger.error("Error enviando correo: %s", str(e))
        return Response({'status': 'error enviando correo'}, status=500)