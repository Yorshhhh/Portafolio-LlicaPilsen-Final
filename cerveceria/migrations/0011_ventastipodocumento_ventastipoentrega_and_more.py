# Generated by Django 5.0.4 on 2024-08-08 19:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cerveceria', '0010_pedido_total_neto_usuario_is_verified'),
    ]

    operations = [
        migrations.CreateModel(
            name='VentasTipoDocumento',
            fields=[
                ('tipo_documento', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('total_ventas', models.IntegerField()),
            ],
            options={
                'db_table': 'view_ventas_documento',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='VentasTipoEntrega',
            fields=[
                ('tipo_entrega', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('total_ventas', models.IntegerField()),
            ],
            options={
                'db_table': 'view_ventas_entrega',
                'managed': False,
            },
        ),
        migrations.AlterModelTable(
            name='ventascomuna',
            table='view_ventas_comuna',
        ),
    ]
