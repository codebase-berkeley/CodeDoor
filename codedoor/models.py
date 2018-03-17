from django.db import models

class Company(models.Model):
    STRUCTURES = (("Startup", "Startup"),
                  ("Boutique", "Boutique"),
                  ("Small", "Small"),
                  ("Medium", "Medium"),
                  ("Large", "Large"))

    name = models.CharField(max_length=100)
    industry = models.CharField(max_length=100)
    website = models.URLField(null=True, blank=True)
    logo = models.ImageField(null=True, blank=True)
    structure = models.CharField(max_length=100, choices=STRUCTURES)

    def __str__(self):
        return self.name


class Profile(models.Model):
    name = models.CharField(max_length=100)
    profile_pic = models.ImageField(null=True, blank=True)
    graduation_year = models.IntegerField()
    current_job = models.CharField(null=True, blank=True, max_length=1000)
    linkedin = models.URLField(null=True, blank=True)
    resume = models.FileField(null=True, blank=True)

    def __str__(self):
        return self.name


class Application(models.Model):
    SEASONS = (('Fall', 'Fall'),
               ('Spring', 'Spring'),
               ('Summer', 'Summer'),
               ('Winter', 'Winter'))

    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    description = models.TextField()
    year = models.IntegerField()
    season = models.CharField(max_length=100, choices=SEASONS)
    position = models.CharField(max_length=500)
    received_offer = models.BooleanField()
    offer_details = models.TextField(null=True, blank=True)
    difficult = models.DecimalField(decimal_places=2, max_digits=10)

    def __str__(self):
        return "{}'s application to {}".format(self.profile.name,
                                               self.company.name)


class Review(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(Profile, on_delete=models.CASCADE)
    rating = models.DecimalField(decimal_places=2, max_digits=10)
    recommend = models.BooleanField()
    review = models.TextField()

    def __str__(self):
        return "{}'s review of {}".format(self.reviewer.name,
                                          self.company.name)


class Question(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    question = models.TextField()
    applicant_answer = models.TextField(null=True, blank=True)
    actual_answer = models.TextField(null=True, blank=True)

    def __str__(self):
        return "{}: {}".format(self.application.company.name,
                               self.question[0:40])
