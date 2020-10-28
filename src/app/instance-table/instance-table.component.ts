import {Component, OnInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import {Instance} from '../models/instance';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-instance-table',
  templateUrl: './instance-table.component.html',
  styleUrls: ['./instance-table.component.css']
})
export class InstanceTableComponent implements OnInit {
  @Input() hasKillButtons = false;
  @Output() toBeKilled = new EventEmitter<string>();

  public instances: Instance[];
  public countAssigned = 0;
  constructor(private dataService: DataService) { }
  ngOnInit(): void {
    this.dataService.getInstances().subscribe(
      data => {
        this.instances = data;
        for (let i = 0; i < this.instances.length; i++) {
          this.dataService.getImage(this.instances[i].image.id).subscribe(
             data => {
              this.instances[i].image = data;
              this.countAssigned += 1;
            }
          );
        }
      }
    );
  }
  kill(id: string): void{
    console.log("kill", id);
    this.toBeKilled.emit(id);
  }
}
