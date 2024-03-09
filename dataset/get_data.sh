#!/bin/bash

# Base URL
base_url="https://opendata.apps.mow.vlaanderen.be/fietstellingen/"

# richtingen
richtingen="richtingen.csv"
#sites
sites="sites.csv"

# URL van de richtingen en sites
url_richtingen="${base_url}${richtingen}"
url_sites="${base_url}${sites}"

if [ ! -e "$richtingen" ]; then
    wget "$url_richtingen" -O "$richtingen"
fi

if [ ! -e "$sites" ]; then
    wget "$url_sites" -O "$sites"
fi

# tellingen
cd data

# startdatum
start_year=2019
start_month=8

# einddatum
end_year=$(date +'%Y')
end_month=$(date +'%m')


for year in {2019..2024}; do
    for month in {1..12}; do
        # stop na de einddatum
        if ( [ $year -gt $end_year ] || ([ $year -eq $end_year ] && [ $month -gt $end_month ])) || ([ $year -lt $start_year ] || ([ $year -eq $start_year ] && [ $month -lt $start_month ])); then
            continue 
        fi
        
        # Formateer maand naar twee cijfers
        month=$(printf "%02d" $month)
        filename="data-${year}-${month}.csv"
        url="${base_url}${filename}"

        if [ ! -e "$filename" ]; then
            wget "$url" -O "$filename"
        fi
    done
done


    