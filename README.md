[![title](screenshots/title.svg)](http://www.eenstukjenostalgie.amsterdam)

<div align="center">
  <img src="screenshots/crosses.svg">
  <h1>Meesterproef Adamnet</h1>
  <p style="width:'50%';">
    For the organisation <a href="http://www.adamnet.nl">Adamnet</a> we created the website <a href="http://www.eenstukjenostalgie.amsterdam">eenstukjenostalgie.amsterdam</a>, where people can create there own <strong>Memories Book</strong>, filled with images from a chosen time period and location.
  </p>
</div>

## Table of Contents

* [How to install](#how-to-install)
* [Frameworks](#frameworks)
* [Features](#features)
* [Concept](#concept)
* [Stakeholders](#stakeholders)
* [User Scenario](#user-scenario)
* [Linked open data](#linked-open-data)
* [Usage](#usage)
* [To do](#to-do)
* [Wishlist](#wishlist)
* [Collaborators](#collaborators)

## How to install

First of all, download or clone the project, navigate to the root folder and install dependencies by `npm install`.
Create a `.env` file with the port number you want to start the server on, for example `PORT=3000`.
Run `npm run build` to build the bundle.js file and last of all, `npm start` to start the server and to work on our application!

## Frameworks

We have used the following frameworks and packages:

**Server:**
- [x] [Express JS](https://expressjs.com/)
- [x] [Express session](https://www.npmjs.com/package/express-session)
- [x] [Body parser](https://www.npmjs.com/package/body-parser)
- [x] [Node fetch](https://www.npmjs.com/package/node-fetch)

**Templating:**
- [x] [EJS](http://ejs.co/)

**Bundling:**
- [x] [Browserify](http://browserify.org/)

**Packages used for the map:**
- [x] [Turf](http://turfjs.org/)
- [x] [Circle to polygon](https://www.npmjs.com/package/circle-to-polygon)
- [x] [Wellknown](https://www.npmjs.com/package/wellknown)

**Generating IDs:**
- [x] [Uuid](https://www.npmjs.com/package/uuid)
- [x] [Shortid](https://www.npmjs.com/package/shortid)

Actor diagram:
//image here

## Features

### General features
---

**Homepage:**
* Create your book of memories of Amsterdam
* Choose between 3 themes:
  * Book about a person
  * Book about a building
  * A blank book to fill in yourself

**Selecting location and time period:**
* Select a location on the map based on a selected radius
* Search for your own street or a street of your choice
* Change the radius on the map to get a more or less precise location
* Select a time period between 1900 and 2018

**Selecting pictures:**
* Browse between the pictures, ordered by year
* Select the images you want to save in your book

**My memories book:**
* Give your book a title
* Browse between the selected pictures, ordered by year
* Browse between different chapters of your book, like 'Your street' or 'Your neighbourhood'.
* Add new chapters from a selection of chapters
* Add or edit descriptions of your choice to the pictures.

<!-- ### Technical features
--- -->

## Concept

//Tell something about the concept for this project

## Stakeholders

//Maybe?

## User Scenario

//Who is gonna use this?

## Linked open data

//Tell something about the data that we use (sparql)

## Usage

//Tell people how to use our application

## To do

//List of things we still need done

## Wishlist

//What would be amazing to have?

## Collaborators

//Us

## Coming soon..

//license
