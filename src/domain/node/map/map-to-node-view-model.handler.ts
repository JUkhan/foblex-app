import { IHandler } from '@foblex/mediator';
import { IFlowNodeViewModel } from '../i-flow-node-view-model';
import { IFlowStorage } from '../../flow.storage';
import { NODE_CONFIGURATION } from '../../configuration';
import { IFlowNodeStorageModel } from '../i-flow-node-storage-model';
import { IFlowGroupStorageModel } from '../../group/i-flow-group-storage-model';
import { EGroupType } from "../../e-node-type";

export class MapToNodeViewModelHandler implements IHandler<void, IFlowNodeViewModel[]> {

  constructor(
    private flow: IFlowStorage
  ) {
  }

  public handle(): IFlowNodeViewModel[] {
    console.log('---node map-----')
    const ts= this.flow.groups.flatMap(g=>this.getNodes(g))
    this.flow.nodes=ts;
    console.log(ts)
    return ts
  }
  private getNodes(group: IFlowGroupStorageModel){
    let posY = group.position.y + 35;
    let nodes: IFlowNodeViewModel[]=[]
    console.log(group.columnNames);
    group.columnNames.forEach((col, idx) => {
      const node: Partial<IFlowNodeStorageModel> = {
        id: `${group.id}-${col}`,
        name: col,
      };
      node.groupId=group.id;
      if ((group.properties["type"] as EGroupType) === EGroupType.LeftTable) {
        node.output = `${group.id}-${col}-${idx}`;
      } else {
        node.input = `${group.id}-${col}-${idx}`;
      }
      node.position = { x: group.position.x + 7, y: posY };
      posY += 28;
      nodes.push(node as any);
    });
    
    return nodes
  }
}
