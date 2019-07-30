import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { appReducers } from './store/app.reducers';
import { TimelineModule } from './timeline/timeline.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        CommonModule,
        StoreModule.forRoot(appReducers),
        EffectsModule.forRoot([]),
        environment.imports,
        TimelineModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
