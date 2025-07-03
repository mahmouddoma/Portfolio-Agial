import { Component } from '@angular/core';
import { CounterComponent } from "../counter/counter.component";

@Component({
  selector: 'app-feature',
  imports: [CounterComponent],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css'
})
export class FeatureComponent {

}
