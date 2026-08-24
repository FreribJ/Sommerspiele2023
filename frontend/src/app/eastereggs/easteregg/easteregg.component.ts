import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Easteregg } from '../../model/objects';
import { allEastereggs } from '../eastereggs.component';
import { ContentService } from '../../content.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-easteregg',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './easteregg.component.html',
  styleUrl: './easteregg.component.css',
})
export class EastereggComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private content = inject(ContentService);
  private auth = inject(AuthService);

  easteregg = signal<Easteregg | undefined>(undefined);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        const found = allEastereggs.find(ee => ee.id === parseInt(idStr, 10));
        this.easteregg.set(found);
        if (found) {
          this.content.postEasteregg(found.id).subscribe(() => {
            this.auth.incrementEasterEggs();
          });
        }
      }
    });
  }
}
