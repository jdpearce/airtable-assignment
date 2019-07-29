import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimelineEventComponent } from './components/timeline-event/timeline-event.component';
import { TimelineComponent } from './components/timeline/timeline.component';

@NgModule({
    declarations: [AppComponent, TimelineComponent, TimelineEventComponent],
    imports: [BrowserModule, CommonModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
