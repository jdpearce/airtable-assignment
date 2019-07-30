import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TimelineEventComponent } from './components/timeline-event/timeline-event.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TimelineEffects } from './store/timeline.effects';
import { timelineReducer } from './store/timeline.reducer';

@NgModule({
    declarations: [TimelineComponent, TimelineEventComponent],
    exports: [TimelineComponent],
    imports: [CommonModule, StoreModule.forFeature('timeline', timelineReducer), EffectsModule.forFeature([TimelineEffects])],
    providers: [DatePipe]
})
export class TimelineModule {}
