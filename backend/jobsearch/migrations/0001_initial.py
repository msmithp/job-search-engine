# Generated by Django 5.1.6 on 2025-03-10 20:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('skill_name', models.CharField(max_length=20)),
                ('category', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('site', models.CharField(max_length=10)),
                ('job_name', models.CharField(max_length=50)),
                ('job_type', models.CharField(blank=True, max_length=10)),
                ('job_desc', models.CharField(max_length=200)),
                ('company', models.CharField(max_length=50)),
                ('city', models.CharField(max_length=20)),
                ('state', models.CharField(max_length=2)),
                ('min_sal', models.FloatField(null=True)),
                ('is_remote', models.BooleanField()),
                ('post_date', models.DateField()),
                ('years_exp', models.IntegerField(null=True)),
                ('skill_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='jobsearch.skill')),
            ],
        ),
        migrations.CreateModel(
            name='AltSkill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('alt_name', models.CharField(max_length=20)),
                ('skill_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='alt_names', to='jobsearch.skill')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.CharField(max_length=20)),
                ('password', models.CharField(max_length=20)),
                ('city', models.CharField(blank=True, max_length=20)),
                ('state', models.CharField(blank=True, max_length=2)),
                ('education', models.CharField(blank=True, max_length=20)),
                ('years_exp', models.IntegerField(null=True)),
                ('skill_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='jobsearch.skill')),
            ],
        ),
    ]
