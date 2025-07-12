<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait Reorderable
{
    public function reorder(Request $request)
    {
        $request->validate([
            'from_index' => 'required|integer',
            'to_index' => 'required|integer',
        ]);

        $items = $this->model::orderBy('sort_order')->get();
        
        if ($request->from_index >= $items->count() || $request->to_index >= $items->count()) {
            return response()->json(['error' => 'Invalid index'], 400);
        }

        // Get the item being moved
        $movedItem = $items[$request->from_index];
        
        // Remove from original position
        $items->splice($request->from_index, 1);
        
        // Insert at new position
        $items->splice($request->to_index, 0, [$movedItem]);

        // Update sort_order for all items
        foreach ($items as $index => $item) {
            $item->update(['sort_order' => $index + 1]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Items reordered successfully'
        ]);
    }

    public function resetOrder()
    {
        $items = $this->model::orderBy('id')->get();
        
        foreach ($items as $index => $item) {
            $item->update(['sort_order' => $index + 1]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order reset successfully'
        ]);
    }
}