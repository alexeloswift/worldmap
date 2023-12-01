import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { APIService } from '../api/api.service';
import { Country } from '../model/counry.model';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css'],
})

export class WorldComponent implements AfterViewInit {
  @ViewChild('worldMap', { static: false }) worldMap!: ElementRef<SVGSVGElement>;

  selectedCountry: Country | undefined;

  constructor(private renderer: Renderer2, private apiService: APIService) { }

  ngAfterViewInit() {
    if (this.worldMap) {
      const paths = this.worldMap.nativeElement.querySelectorAll('svg path');

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i] as SVGPathElement;

        this.renderer.listen(path, 'click', () => {
          this.handlePathClick(path);
        });

        this.renderer.listen(path, 'mouseenter', () => {
          this.handlePathHover(path, true);
        });

        this.renderer.listen(path, 'mouseleave', () => {
          this.handlePathHover(path, false);
        });
      }
    }
  }

  handlePathClick(path: SVGPathElement) {
    const isoCode = path.id;
    console.log('Path clicked:', path.getAttribute('title'));

    if (isoCode) {
      this.apiService.getCountryInfo(isoCode).subscribe(
        (country) => {
          this.selectedCountry = country;
          console.log(this.selectedCountry);
        },
        (error) => {
          console.error('Error fetching country info:', error);
        }
      );
    }
  }

  handlePathHover(path: SVGPathElement, isHovered: boolean) {
    if (isHovered) {
      this.renderer.setStyle(path, 'fill', 'red');
    } else {
      this.renderer.setStyle(path, 'fill', 'white');
    }
  }
}