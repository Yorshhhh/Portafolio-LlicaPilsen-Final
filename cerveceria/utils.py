from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from django.core.mail import EmailMessage
import logging
from rest_framework.response import Response
import os

logger = logging.getLogger(__name__)

def generate_pdf(pedido, usuario, detalles_pedido, comuna, ciudad, region):
    try:
        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)

        c.drawString(100, 750, f"Pedido Número: {pedido.cod_pedido}")
        c.drawString(100, 735, f"Fecha del Pedido: {pedido.fecha_pedido.strftime('%d-%m-%Y')}")
        c.drawString(100, 720, f"Nombre del Cliente: {usuario.nombres} {usuario.apellidos}")
        c.drawString(100, 705, f"Correo: {usuario.correo}")
        c.drawString(100, 690, f"Dirección: {usuario.direccion}")
        c.drawString(100, 675, f"Comuna: {comuna.nombre if comuna else 'N/A'}")
        c.drawString(100, 660, f"Ciudad: {ciudad.nombre if ciudad else 'N/A'}")
        c.drawString(100, 645, f"Región: {region.nombre if region else 'N/A'}")

        y = 620
        for detalle in detalles_pedido:
            c.drawString(100, y, f"Producto: {detalle.cod_producto.nombre_producto}")
            c.drawString(300, y, f"Cantidad: {detalle.cantidad}")
            c.drawString(400, y, f"Precio Unitario: ${detalle.precio_unitario}")
            y -= 15

        c.drawString(100, y - 20, f"Total Boleta: ${pedido.total_boleta}")
        c.drawString(100, y - 35, f"IVA: ${pedido.iva}")

        c.save()
        buffer.seek(0)

        # Guardar el PDF para verificación
        pdf_path = 'C:/Users/Yorshhh/Documents/Polo/pedido_confirmacion.pdf'  # Cambia esta ruta según tu sistema operativo
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