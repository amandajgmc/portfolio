import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements AfterViewInit {
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    // Selecionar o elemento com a classe parallax-mirror
    // Obtenha uma referência para o componente pai ou para o elemento que contém os elementos com a classe parallax-mirror
    const componentePai =
      this.elementRef.nativeElement.parentElement.parentElement;

    // Encontre todos os elementos com a classe parallax-mirror dentro do componente pai
    const elementosParallaxMirror =
      componentePai.querySelectorAll('.parallax-mirror');

    // Defina o estilo display: none para cada elemento encontrado
    elementosParallaxMirror.forEach((e: any) => {
      e.style.display = 'none';
    });
  }
}
