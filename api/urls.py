from django.urls import path

from api import views

urlpatterns = [
    path("health", views.health),
    path("unidades", views.list_unidades),
    path("unidades/<int:unidade_id>", views.get_unidade),
]
