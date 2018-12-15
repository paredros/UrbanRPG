from django import template
register = template.Library()

from ..models import TestModel

@register.filter(name='multiply')
def multiply(value, arg):
    print(value,arg)
    return value*arg