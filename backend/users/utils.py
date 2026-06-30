from django.contrib.auth.models import Group
def create_staff_group():
    # Check if the staff group already exists
    if not Group.objects.filter(name='Staff').exists():
        Group.objects.create(name='Staff')
