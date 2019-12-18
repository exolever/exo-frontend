import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducer as rolesReducer } from '@core/modules/roles/store/roles.reducer';
import { RolesEffect } from '@core/modules/roles/store/roles.effect';
import { RolesService } from '@core/modules/roles/services/roles.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('roles', rolesReducer),
    EffectsModule.forFeature([RolesEffect]),
  ],
  providers: [
    RolesService,
  ]
})
export class RolesModule { }
