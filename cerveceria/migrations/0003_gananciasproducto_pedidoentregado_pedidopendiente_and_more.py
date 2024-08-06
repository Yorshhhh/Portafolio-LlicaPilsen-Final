# Generated by Django 5.0.4 on 2024-07-08 02:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cerveceria', '0002_gananciasproducto_historialpedido_pedidopendiente_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='GananciasProducto',
            fields=[
                ('cod_producto', models.IntegerField(primary_key=True, serialize=False)),
                ('nombre_producto', models.CharField(max_length=100)),
                ('total', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'view_ventas_producto',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='PedidoEntregado',
            fields=[
                ('cod_pedido', models.IntegerField(primary_key=True, serialize=False)),
                ('nombre_cliente', models.CharField(max_length=255)),
                ('correo', models.EmailField(max_length=254)),
                ('telefono', models.CharField(max_length=20)),
                ('id_detalle_pedido', models.CharField(max_length=255)),
                ('cod_producto', models.CharField(max_length=255)),
                ('nombre_producto', models.CharField(max_length=255)),
                ('cantidad', models.PositiveIntegerField()),
                ('precio_unitario', models.DecimalField(decimal_places=2, max_digits=10)),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('fecha_pedido', models.DateTimeField()),
                ('fecha_entrega', models.DateTimeField()),
            ],
            options={
                'db_table': 'view_pedidos_entregados',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='PedidoPendiente',
            fields=[
                ('nombre_cliente', models.CharField(max_length=100)),
                ('correo', models.EmailField(max_length=254)),
                ('telefono', models.CharField(max_length=20)),
                ('cod_pedido_id', models.IntegerField(primary_key=True, serialize=False)),
                ('id_detalle_pedido', models.IntegerField()),
                ('cod_producto', models.IntegerField()),
                ('nombre_producto', models.CharField(max_length=20)),
                ('cantidad', models.IntegerField()),
                ('precio_unitario', models.IntegerField()),
                ('total', models.IntegerField()),
                ('fecha_pedido', models.DateField()),
            ],
            options={
                'db_table': 'view_pedidos_pendientes',
                'managed': False,
            },
        ),
        migrations.AlterModelOptions(
            name='pedido',
            options={'ordering': ['fecha_pedido'], 'verbose_name': 'Pedido', 'verbose_name_plural': 'Pedidos'},
        ),
        migrations.AddField(
            model_name='pedido',
            name='codigo_envio',
            field=models.CharField(blank=True, default=None, help_text='Código de envío proporcionado por el servicio de mensajería.', max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='pedido',
            name='comuna_envio',
            field=models.CharField(blank=True, default=None, help_text='Comuna de destino para el despacho a domicilio.', max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='pedido',
            name='tipo_entrega',
            field=models.CharField(blank=True, choices=[('retiro', 'Retiro en tienda'), ('domicilio', 'Despacho a domicilio')], default=None, help_text="Tipo de entrega: 'retiro', 'domicilio'.", max_length=20, null=True),
        ),
    ]