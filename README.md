[![Build Status](https://travis-ci.org/jdpearce/airtable-assignment.svg?branch=master)](https://travis-ci.org/jdpearce/airtable-assignment)

# AirtableAssignment

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Deployed Instance

You can see a deployed instance of the application at [https://jhp-airtable-assignment.herokuapp.com/](https://jhp-airtable-assignment.herokuapp.com/)

## How long you spent on the assignment.

In total, maybe 6 or 7 hours over several days. A good portion of that was researching dead ends like the [Angular Materal](https://material.angular.io) library for drag and drop which just didn't work out.

## What you like about your implementation.

It's a relatively simple implementation, with a straightforward design which scales pretty well down to smallish screen sizes (I'd probably have to start adding in media queries below about 800px width). There's a lot of room for modifications and it should be relatively easy to make them.

## What you would change if you were going to do it again.

-   [ ] Firstly take a step back and consider a design which would work for whatever user need is being fulfilled by this component.
-   [ ] Test this with actual users
-   [ ] Review Accessibility requirements - this isn't especially accessible at the moment. You can change zoom and scroll along the timeline, but you can't change any of the events.
-   [ ] Research drag and drop APIs more thoroughly
-   [ ] Use a date arithmetic library (e.g. moment)
-   [ ] Revisit the layout algorithm to take into account the event title - this would require measuring each event, possibly with a hidden div, or by re-implementing in canvas?
-   [ ] Possibly take a leaf from Google Calendar or Trello's book regarding updating the event title and implement an overlay with an update form and controls
-   [ ] Package the component as an [Angular Element](https://angular.io/guide/elements)
-   [ ] Change the drag behaviour to be more like Google Calendar (e.g. drag handles at start and end of an event which can be dragged along the timeline to lengthen or shorten the event)
-   [ ] Actually use the NgRX scaffolding that I added for things like the drag events (that was the initial intention, but I ran out of time)

## How you made your design decisions. For example, if you looked at other timelines for inspiration, please note that.

I was vaguely inspired by Trello and Google Calendar. I would have loved to implement the kind of drag and drop that Trello uses, but didn't have time.

A lot of the design decisions were grounded in expediency. I don't think the method of dragging and dropping which only updates the start explicitly is particularly useful, for example, and the default zoom level only shows this particular data set well. The component hasn't been tested with other data sets and it may not look as good for those (particularly any with very short time-frames).

## How you would test this if you had more time.

Some tests are already included, although not for the layout of the component itself. Angular does include the capability to test the generated HTML and this would be the next step. I could also look at adding e2e tests which would test the application as a whole.

I also included jasmine-marbles for testing the effects I was going to add to deal with drag events, so this would be another step.
