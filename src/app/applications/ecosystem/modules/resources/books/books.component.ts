import { Component, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-resources-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  books = [];
  constructor(
    private translateService: TranslateService
  ) {}
  ngOnInit() {
    this.books = [{
      title: this.translateService.instant('ECOSYSTEM.BOOKS.BOOK_1.TITLE'),
      authors: 'F. Palao, M. Lapierre & Salim Ismail',
      description:  this.translateService.instant('ECOSYSTEM.BOOKS.BOOK_1.DESCRIPTION'),
      website: 'https://www.openexo.com/books/',
      buy: 'https://amzn.to/2Y3YnII',
      thumbnail: '/assets/books/exponential-book.png',
      downloads: [
        {
          language: this.translateService.instant('ECOSYSTEM.BOOKS.LANGUAGES.ENGLISH'),
          pdf: 'http://bit.ly/2kn8LZ8-eng'
        },
        {
          language: this.translateService.instant('ECOSYSTEM.BOOKS.LANGUAGES.SPANISH'),
          pdf: 'http://bit.ly/2lYTm1O-spa'
        },
        {
          language: this.translateService.instant('ECOSYSTEM.BOOKS.LANGUAGES.GERMAN'),
          pdf: 'http://bit.ly/2m1tQZF-ger'
        },
        {
          language: this.translateService.instant('ECOSYSTEM.BOOKS.LANGUAGES.PORTUGUESE'),
          pdf: 'http://bit.ly/2kXhtOb-por'
        },
        {
          language: this.translateService.instant('ECOSYSTEM.BOOKS.LANGUAGES.DUTCH'),
          pdf: 'http://bit.ly/2WD1pzy-dutch'
        },
      ]
    },
    {
      title: this.translateService.instant('ECOSYSTEM.BOOKS.BOOK_2.TITLE'),
      authors: 'Salim Ismail, Yuri Van Geest, Michael Malone',
      description:  this.translateService.instant('ECOSYSTEM.BOOKS.BOOK_2.DESCRIPTION'),
      website: 'https://www.openexo.com/books/',
      buy: 'https://www.amazon.com/Exponential-Organizations-organizations-better-cheaper-ebook/dp/B00OO8ZGC6',
      thumbnail: '/assets/books/exponential-organizations.png',
      downloads: []
    }];
  }

  goTo(url: string) {
    window.open(url, '_blank');
  }
}
