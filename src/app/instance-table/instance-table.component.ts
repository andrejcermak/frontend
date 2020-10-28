import {Component, OnInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import {Instance} from '../models/instance';
import {DataService} from '../services/data.service';
import {delay} from 'rxjs/operators';

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
  public ready = false;
  constructor(private dataService: DataService) { }
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then();
  }
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
    this.delay(3500).then(any => {
     this.ready = true;
    });
  }
  kill(id: string): void{
    console.log("kill", id);
    this.toBeKilled.emit(id);
  }
}
