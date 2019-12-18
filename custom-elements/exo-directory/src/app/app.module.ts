import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatPaginatorModule,
  MatCardModule,
  MatIconModule
} from '@angular/material';

import { ExOAvatarSystemModule, ExOAvatarModule } from '@openexo/design-system';

import { LoaderComponent } from './loader/loader.component';
import { PublicDirectoryComponent } from './public-directory/public-directory.component';
import { ApiService } from './api.service';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    ExOAvatarSystemModule,
    ExOAvatarModule
  ],
  declarations: [
    LoaderComponent,
    PublicDirectoryComponent,
  ],
  entryComponents: [PublicDirectoryComponent],
  providers: [ApiService],
  bootstrap: []
})
export class AppModule {
  constructor(
    private injector: Injector
  ) {}

  ngDoBootstrap() {
    const el = createCustomElement(PublicDirectoryComponent, { injector: this.injector });
    customElements.define('app-public-directory', el);
  }
}
