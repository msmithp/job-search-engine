# Generated by Django 5.1.6 on 2025-03-13 18:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jobsearch', '0005_rename_skill_altskill_skill_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='altskill',
            old_name='skill_name',
            new_name='skill',
        ),
    ]
