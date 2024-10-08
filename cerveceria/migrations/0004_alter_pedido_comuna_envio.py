# Generated by Django 5.0.4 on 2024-07-08 02:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cerveceria', '0003_gananciasproducto_pedidoentregado_pedidopendiente_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pedido',
            name='comuna_envio',
            field=models.CharField(blank=True, choices=[('lota', 'Lota'), ('coronel', 'Coronel'), ('san_pedro', 'San Pedro')], default=None, help_text="Comuna de destino para el despacho a domicilio: 'lota', 'coronel', 'san_pedro'.", max_length=20, null=True),
        ),
    ]
