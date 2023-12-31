import { Component } from '@angular/core';
import {ContentService} from "../content.service";

@Component({
  selector: 'app-guessing',
  templateUrl: './guessing.component.html',
  styleUrls: ['./guessing.component.css']
})
export class GuessingComponent {

  typedGuess?: number
  confirmedGuess?: number

  isLoading = false

  constructor(private service: ContentService) {
    this.service.getGuess().subscribe(guess => {
      if (guess !== -1) {
        this.typedGuess = guess
        this.confirmedGuess = guess
      }
    })
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.key == 'Enter')
      this.onSendClick()
  }

  onSendClick() {
    this.isLoading = true
    this.typedGuess = Math.floor(this.typedGuess!)
    this.service.putGuess(this.typedGuess!).subscribe(guess => {
      this.confirmedGuess = guess
      this.isLoading = false
    }, error => {
      if (error.status === 403) {
        alert('Das Eintragen von Schätzungen wurde noch nicht freigegeben oder wurde schon beendet. ')
      } else {
        alert('Fehler beim Schätzen. Bitte versuchen Sie es später erneut.')
      }
      this.isLoading = false
    })
  }

  protected readonly Math = Math;
}
