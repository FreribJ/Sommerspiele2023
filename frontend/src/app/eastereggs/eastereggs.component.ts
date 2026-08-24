import { Component, OnInit, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ContentService } from '../content.service';
import { Easteregg } from '../model/objects';

export const allEastereggs: Easteregg[] = [
  {id: 19816, srcImage: './assets/19816.png', title: 'Das Geschäft muss sein'},
  {id: 14983, srcImage: './assets/14983.jpg', title: 'Prost!!!'},
  {id: 16588, srcImage: './assets/16588.jpg', title: 'Ab in den Urlaub!'},
  {id: 49685, srcImage: './assets/49685.png', title: 'Dads am Grillen'},
  {id: 31813, srcImage: './assets/31813.jpg', title: 'Betrunken du sein musst'},
  {id: 48165, srcImage: './assets/48165.jpg', title: 'Alleine Trinken tut man nicht!'},
  {id: 47916, srcImage: './assets/47916.png', title: 'When you´re Single'},
  {id: 48193, srcImage: './assets/48193.webp', title: 'Professional alcoholic'},
  {id: 19843, srcImage: './assets/19843.png', title: 'Ich als Kind'},
  {id: 25488, srcImage: './assets/25488.jpg', title: 'Jeder als Kind'},

  {id: 64818, srcImage: './assets/64818.jpg', title: 'Ich trinke heute nur eins'},
  {id: 18971, srcImage: './assets/18971.jpg', title: 'BIR'},
  {id: 81853, srcImage: './assets/81853.png', title: 'self confidence'},
  {id: 64182, srcImage: './assets/64182.jpg', title: 'Ahhhhhh'},
  {id: 18946, srcImage: './assets/18946.jpg', title: 'Spannend'},
  {id: 71865, srcImage: './assets/71865.webp', title: 'Wo TÜV?'},
];

@Component({
  selector: 'app-eastereggs',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './eastereggs.component.html',
  styleUrl: './eastereggs.component.css',
})
export class EastereggsComponent implements OnInit {
  private content = inject(ContentService);
  private router = inject(Router);

  foundEastereggs = signal<Easteregg[]>([]);
  typedNumber = signal<number | null>(null);
  notFound = signal(false);

  ngOnInit(): void {
    this.content.getFoundEastereggs().subscribe(result => {
      const found: Easteregg[] = [];
      result.forEach(ee => {
        const temp = allEastereggs.find(eee => eee.id === ee.id);
        if (temp) found.push(temp);
      });
      this.foundEastereggs.set(found);
    });
  }

  onEnterPress(evt: KeyboardEvent): void {
    if (evt.key === 'Enter') {
      this.onGoClick();
    } else {
      this.notFound.set(false);
    }
  }

  onGoClick(): void {
    const num = this.typedNumber();
    if (num) {
      const id = Math.floor(num);
      if (allEastereggs.find(ee => ee.id === id)) {
        this.router.navigate(['eastereggs', id]);
      } else {
        this.notFound.set(true);
      }
    }
  }
}
