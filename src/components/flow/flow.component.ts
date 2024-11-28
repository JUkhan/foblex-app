import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, OnInit,
  ViewChild,
} from '@angular/core';
import {
  FCreateNodeEvent, EFMarkerType,
  FCanvasComponent, FFlowModule, FZoomDirective,
  FReassignConnectionEvent, FCreateConnectionEvent,EFResizeHandleType
} from '@foblex/flow';
import { IPoint, Point } from '@foblex/2d';
import { EGroupType, ENodeType } from '../../domain/e-node-type';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { PaletteComponent } from '../palette/palette.component';
import { NodeComponent } from '../node/node.component';
import { FlowService } from '../../domain/flow.service';
import { IFlowViewModel } from '../../domain/i-flow-view-model';
import { GroupComponent } from '../group/group.component';
import { IFlowGroupStorageModel } from '../../domain/group/i-flow-group-storage-model';
import { IFlowNodeStorageModel } from '../../domain/node/i-flow-node-storage-model';
import {IFlowConnectionViewModel} from '../../domain/connection/i-flow-connection-view-model'
import {PropertyComponent} from '../property/property.component'
import { IFlowGroupViewModel } from '../../domain/group/i-flow-group-view-model';


@Component({
  selector: 'visual-programming-flow',
  templateUrl: './flow.component.html',
  styleUrls: [ './flow.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FlowService
  ],
  imports: [
    FFlowModule,
    PropertyComponent,
    ToolbarComponent,
    PaletteComponent,
    NodeComponent,
    GroupComponent,
  ]
})
export class FlowComponent implements OnInit {

  protected readonly eResizeHandleType = EFResizeHandleType;
  public selectedGroup?:IFlowGroupViewModel
  public selectedConnection?:IFlowConnectionViewModel


  protected viewModel: IFlowViewModel = {
    nodes: [],
    groups:[],
    connections: []
  };

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvasComponent!: FCanvasComponent;

  @ViewChild(FZoomDirective, { static: true })
  public fZoomDirective!: FZoomDirective;

  protected readonly eMarkerType = EFMarkerType;

  constructor(
    private apiService: FlowService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.getData();
  }

  public onCanvasClick(ev:any): void{
    if(ev.target.id==='f-flow-0'){
      this.selectedGroup=undefined;
      this.selectedConnection=undefined;
    }
  }
  public onGroupClick(group:IFlowGroupViewModel): void{
    this.selectedGroup=group;
    this.selectedConnection=undefined;
  }
  public typeChange(newType: string): void{
    if(this.selectedGroup){
      this.apiService.typeChange(this.selectedGroup, newType)
      this.getData();
    }
  }
  public removeGroup(): void{
    if(this.selectedGroup){
      this.apiService.removeGroup(this.selectedGroup)
      this.getData();
      this.selectedGroup=undefined;
    }
  }
  public joinChange(joinName: string):void{
    if(this.selectedConnection){
    this.apiService.joinChange(this.selectedConnection, joinName)
    this.getData();
    }
  }
  public removeConnection(): void {
    if(this.selectedConnection){
    this.apiService.removeConnection(this.selectedConnection)
    this.getData();
    this.selectedConnection=undefined;
    }
  }
  public onConnectionClick(conn:IFlowConnectionViewModel): void{
   this.selectedConnection=conn;
   this.selectedGroup=undefined;
  }
  public onGroupSizeChanged(rect: any, group:IFlowGroupViewModel): void {
    this.apiService.onGroupSizeChanged(rect, group)
  }

  public onInitialized(): void {
    //this.fCanvasComponent.fitToScreen(new Point(40, 40), false);
    //this.fCanvasComponent.resetScaleAndCenter()
  }

  public getData(): void {
    this.viewModel = this.apiService.getFlow();
    this.changeDetectorRef.markForCheck();
  }

  public onNodeAdded(event: FCreateNodeEvent): void {
    this.apiService.addGroup(event.data, event.rect, this.viewModel.groups.length===0?EGroupType.LeftTable:EGroupType.RightTable);
    this.getData();
  }

  public onReassignConnection(event: FReassignConnectionEvent): void {
    console.log('reassign connection', event)
  }

  public onConnectionAdded(event: FCreateConnectionEvent): void {
    if (!event.fInputId) {
      return;
    }
    this.apiService.addConnection(event.fOutputId, event.fInputId);
    this.getData();
  }

  public onNodePositionChanged(point: IPoint, node: IFlowGroupStorageModel): void {
    this.apiService.moveGroup(node.id, point);
  }
}
