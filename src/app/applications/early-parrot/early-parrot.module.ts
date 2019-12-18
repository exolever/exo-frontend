import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { EarlyParrotComponent } from '@applications/early-parrot/containers/early-parrot.component';
import { EarlyParrotRoutingModule } from '@applications/early-parrot/early-parrot-routing.module';
import { EarlyParrotResolver } from '@applications/early-parrot/services/early-parrot.resolver';
import { LoaderModule } from '@loaders/loader.module';

@NgModule({
  declarations: [
    EarlyParrotComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EarlyParrotRoutingModule,
    LoaderModule,
  ],
  providers: [
    EarlyParrotResolver,
  ],
})
export class EarlyParrotModule { }
