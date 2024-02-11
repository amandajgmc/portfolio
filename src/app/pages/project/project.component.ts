import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, projects } from 'src/app/database/projects';
import { Location } from '@angular/common';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  private projectId;
  protected project!: Project;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this.projectId = this.activatedRoute.snapshot.params['projectId'];
    var projectData = projects.find((e) => e.id == this.projectId);
    // if (projectData) {
    this.project = projectData ?? projects[0];
    // } else {
    //   this.location.back();
    // }
  }

  ngOnInit(): void {}
}
