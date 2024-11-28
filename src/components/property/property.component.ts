import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { FlowComponent } from '../flow/flow.component';
import { AsyncPipe } from '@angular/common';
import { IFlowGroupViewModel } from '../../domain/group/i-flow-group-view-model';
import {IFlowConnectionViewModel} from '../../domain/connection/i-flow-connection-view-model'

@Component({
  selector: 'visual-programming-property',
  templateUrl: './property.component.html',
  styleUrls: [ './property.component.scss' ],
  standalone: true,
  
  viewProviders:[AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyComponent {

  @Input()
  public selectedGroup?:IFlowGroupViewModel
  @Input()
  public selectedConnection?:IFlowConnectionViewModel

  constructor(
    public flowComponent: FlowComponent
  ) {
  }

  public onZoomIn(): void {
    this.flowComponent.fZoomDirective.zoomIn();
  }

  public onZoomOut(): void {
    this.flowComponent.fZoomDirective.zoomOut();
  }

  public onFitToScreen(): void {
    this.flowComponent.fCanvasComponent.fitToScreen();
  }

  public onOneToOne(): void {
    //this.flowComponent.fCanvasComponent.oneToOne();
    this.flowComponent.fCanvasComponent.resetScaleAndCenter()
  }
}
