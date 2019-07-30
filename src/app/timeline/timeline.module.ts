import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TimelineEffects } from './store/timeline.effects';
import { timelineReducer } from './store/timeline.reducer';

@NgModule({
    declarations: [TimelineComponent],
    exports: [TimelineComponent],
    imports: [
        CommonModule,
        StoreModule.forFeature('timeline', timelineReducer),
        EffectsModule.forFeature([TimelineEffects]),
        DragDropModule
    ],
    providers: [DatePipe]
})
export class TimelineModule {}
