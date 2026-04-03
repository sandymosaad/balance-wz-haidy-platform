'use client';

import {useState} from 'react';
import {ArrowDown, ArrowUp} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {reorderVideosInPlaylistAction} from '@/server/actions/admin-video.actions';

type Item = {id: string; title: string};

type ReorderPageProps = {
  params: {playlistId: string};
};

export default function ReorderPlaylistVideosPage({params}: ReorderPageProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [message, setMessage] = useState('Load this page after adding videos to reorder them.');

  function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    if (!item) return;
    next.splice(nextIndex, 0, item);
    setItems(next);
  }

  async function saveOrder() {
    if (!items.length) return;
    const result = await reorderVideosInPlaylistAction(params.playlistId, items.map((item) => item.id));
    setMessage(result.success ? 'Order saved successfully.' : result.error?.message ?? 'Failed to save order.');
  }

  return (
    <section className="space-y-5">
      <Heading level={1}>Reorder Videos</Heading>
      <Text>{message}</Text>

      <div className="space-y-2 rounded-2xl border border-art-sage bg-art-cream p-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-art-sage/50 px-3 py-2">
            <span>{item.title}</span>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={() => move(index, -1)}><ArrowUp className="h-4 w-4" /></Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => move(index, 1)}><ArrowDown className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={saveOrder}>Save Order</Button>
    </section>
  );
}
