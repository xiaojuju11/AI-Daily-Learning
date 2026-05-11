import { 
  ReactFlow, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Controls, 
  MiniMap, 
  Background, 
  BackgroundVariant,
  Handle,
  Position
 } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, type: 'red', data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, type: 'blue', data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];


function RedNode({data}) {
  return (
    <div style={{ width: '100px', height: '100px', backgroundColor: 'red', textAlign: 'center' }}>
      <Handle type="source" position={Position.Right}></Handle>
      <Handle type="target" position={Position.Bottom}></Handle>
      <div>{data.label}</div>
    </div>
  )
}

function BlueNode({data}) {
  return (
    <div style={{ width: '50px', height: '50px', backgroundColor: 'blue', textAlign: 'center', color: 'white' }}>
      <Handle type="source" position={Position.Left}></Handle>
      <Handle type="target" position={Position.Top}></Handle>
      <div>{data.label}</div>
    </div>
  )
}


export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params) => {
    setEdges((eds) => addEdge(params, eds));
  }

  return (
    <div style={{ width: '800px', height: '500px', border: '1px solid #000', margin: '0 auto' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={{
          red: RedNode,
          blue: BlueNode,
        }}
      >
        <Controls />
        <MiniMap zoomable/>
        <Background variant={BackgroundVariant.Lines} />
      </ReactFlow>
    </div>
  )
}