import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable({
    providedIn: 'root'
})
export class TimelineEffects {
    constructor(private actions$: Actions) {}
}
