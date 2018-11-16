import csv
import json
import requests
import boto3
import time
from api_keys import s3_access_keys

company_logos_bucket = 'codedoor-companies-logos'
s3 = boto3.resource('s3', aws_access_key_id=s3_access_keys["id"],
                    aws_secret_access_key=s3_access_keys["secret"])

lst = []
pk_end = 13948

def log(stuff):
    print("TSTAMP: {} LOG: {}".format(time.time(), stuff))

with open('companies.csv', newline='', encoding='utf-8') as f, \
    open('companies_processed.csv', 'w+', encoding='utf-8') as d:

    next(f)
    reader = csv.reader(f)
    writer = csv.writer(d)
    pk = 1
    for row in reader:
        if pk >= pk_end:
            break
        websites = row[2].split(';')
        website = websites[0]
        if website.startswith("http://"):
            url = website[len("http://"):]
        elif website.startswith("https://"):
            url = website[len("https://"):]
        else:
            url = website

        logo = None
        keep_trying = True
        while keep_trying:
            img = requests.get('https://logo.clearbit.com/' + url)
            if img.status_code == 200:
                keep_trying = False
                img_data = img.content
                try:
                    s3.Bucket(company_logos_bucket).put_object(Key=str(pk), Body=img_data, ACL='public-read')
                    url = "https://s3-us-west-1.amazonaws.com/" + company_logos_bucket + "/" + str(pk)
                    log("Got logo for pk {} at: {}".format(pk, url))
                    logo = url
                except Exception as e:
                    log("Exception thrown when uploading image for pk {}, content {}".format(pk, e))
            elif img.status_code in [400, 404, 504]:
                log("Error code {}, content {} for pk {}".format(img.content, img.status_code, pk))
                keep_trying = False
            else:
                log("API error {}: {} on pk: {}, sleep 1 minute and retry...".format(img.content, img.status_code, pk))
                time.sleep(60)

        name = row[1][:100]
        industry = row[3][:100]
        fund = 0
        structure = 'Startup'
        try:
            fund = int(row[4])
        except ValueError:
            pass
        if fund > 2000000:
            structure = 'Large'
        elif fund > 1000000:
            structure = 'Medium'
        elif fund > 500000:
            structure = 'Small'
        elif fund > 250000:
            structure = 'Boutique'
        else:
            structure = 'Startup'

        writer.writerow([name, industry, website, logo, structure])
        # company_fields = {"name": name,
        #                   "industry": industry,
        #                   "website": website,
        #                   "logo": logo,
        #                   "structure": structure}
        # company = {"model": "codedoor.company",
        #            "pk": pk,
        #            "fields": company_fields}
        # lst.append(company)
        pk += 1

# with open('codedoor/fixtures/companies.json', 'w+') as g:
#     g.write(json.dumps(lst))
