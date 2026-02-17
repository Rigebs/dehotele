import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { LoadingSpinner } from './shared/components/loading-spinner/loading-spinner';
import { Toast } from './shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, LoadingSpinner, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
