  
# Force Network

Draws a force-directed graph. Read more at [d3-force-simulation](https://github.com/d3/d3-force).

## Installing

npm i --save @ngx-dino/core @ngx-dino/force-network
 
	import { NgModule } from '@angular/core';
	import { CommonModule } from '@angular/common';
	
	import { CoreModule } from '@ngx-dino/core';
	import { ForceNetworkModule } from '@ngx-dino/force-network';


	@NgModule({
	...
	imports: [CommonModule, CoreModule, ForceNetworkModule, ...]
	...
	})

## Usage Example

```js
<dino-force-network
	[height]="height"
	[width]="width"
	[margin]="margin"
	[nodeSizeField]="fields.nodeSizeField"
	[nodeIdField]="fields.nodeIdField"
	[nodeColorField]="fields.nodeColorField"
	[nodeLabelField]="fields.nodeLabelField"
	[linkIdField]="fields.edgeIdField"
	[linkSourceField]="fields.edgeSourceField"
	[linkTargetField]="fields.edgeTargetField"
	[linkSizeField]="fields.edgeSizeField"
	[nodeColorRange]="nodeColorRange"
	[nodeSizeRange]="nodeSizeRange"
	[enableTooltip]="enableTooltip"
	[tooltipTextField]="fields.tooltipTextField"
	[chargeStrength]="visChargeStrength"
	[nodeStream]="nodeStream"
	[linkStream]="edgeStream">
</dino-force-network>

```
## API Summary

#### dino-force-network

| Name | Type | Description |
| --- | --- | --- |
| `[nodeStream]` | Observable<RawChangeSet\<any>> | Data stream of nodes
| `[linkStream]` | Observable<RawChangeSet\<any>> | Data stream of links
| `[margin]` | Object | Margin values for the visualization container. Usage Format - ``` { top: 20, right: 15, bottom: 60, left: 60 }```
| `[width]` | number | Width of the visualization container
| `[height]` | number | Height of the visualization container
| `[nodeSizeField]` | BoundField\<string> | Field encoding for size of nodes
| `[nodeColorField]` | BoundField\<string> | Field encoding for color of nodes
| `[nodeIdField]` | BoundField\<string> | Field encoding for ID of nodes
| `[nodeLabelField]` | BoundField\<string> | Field encoding for labels of nodes
| `[labelSizeField]` | string | Field encoding for size of labels of nodes *Not supported currently.*
| `[linkIdField]` | BoundField\<string> | Field encoding for ID of links
| `[linkSourceField]` | BoundField\<string> | Field encoding for sources of links
| `[linkTargetField]` | BoundField\<string> | Field encoding for targets of links
| `[linkSizeField]` | BoundField\<number> | Field encoding for size/thickness of links
| `[linkColorField]` | string | Field encoding for color of links
| `[linkOpacityField]` | string | Field encoding for opacity of links
| `[tooltipTextField]` | BoundField\<number \| string> | Field encoding for tooltip text
| `[enableTooltip]` | boolean | Tooltip toggle
| `[nodeSizeRange]` | number[] | Size range for nodes
| `[labelSizeRange]` | number[] | Size range for labels
| `[nodeColorRange]` | string[] | Color range for nodes
| `[linkSizeRange]` | number[] | Size/thickness range for links
| `[linkColorRange]` | string[] | Color range for links
| `[linkOpacityRange]` | number[] | Opacity range for links
| `[minPositionX]` | number | *Not supported currently.*
| `[minPositionY]` | number | *Not supported currently.*
| `[chargeStrength]` | number | Charge force between nodes in the force simulation. Read more at [d3-force/manyBody_strength](https://github.com/d3/d3-force/blob/master/README.md#manyBody_strength)
| `[linkDistance]` | number | Link distance parameter for the force-network simulation. Read more - "The link force pushes linked nodes together or apart according to the desired [link distance]"(https://github.com/d3/d3-force/blob/master/README.md#link_distance)

## Keywords
force-simulation, d3, angular, typescript, visualization