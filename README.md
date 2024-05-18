# Datavisualisatie: Fietsen

This is a project for the Datavisualisatie course at UGent.
We visualised the data of multiple bicycle counting places around Flanders.


## Authors

  - **Seppe Van Rijsselberge**
    [sevrijss](https://github.com/sevrijss)
  - **Jonas Bylé**
    [jbvilla](https://github.com/jbvilla)
  - **Michiel Lachaert**
    [milachae](https://github.com/milachae)

## Dataset

We used the data from Agenschap Wegen en Verkeer. The raw data can be found [here](https://opendata.apps.mow.vlaanderen.be/fietstellingen/index.html).


# Developing

This project is made with [Observable Framework](https://observablehq.com/framework) project. To start your developing environment, run:

```
node docs/data/allFilteredData.js
npm run dev
```

Then visit <http://localhost:3000> to preview the data visualisations.

# Building

To build our visualisations as sa static website, run the following commands.
```
node docs/data/allFilteredData.js
npm run dev
```
The static website can be found in de `.dist/` folder.
