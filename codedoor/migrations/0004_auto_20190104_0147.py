# Generated by Django 2.0.1 on 2019-01-04 01:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('codedoor', '0003_auto_20190101_0200'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='difficult',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='company',
            name='avg_rating',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='review',
            name='rating',
            field=models.FloatField(),
        ),
    ]
