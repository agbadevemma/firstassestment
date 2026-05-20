import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/products-store";
import { formatPrice } from "@/lib/format";



export default function ProductDetailsSheet({
  product,
  onOpenChange,
}: {
  product: Product | null;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Sheet open={!!product} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        {product && (
          <>
            <SheetHeader>
              <SheetTitle className="text-xl">{product.name}</SheetTitle>
              <SheetDescription>Product details</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6 px-4">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-semibold">
                  {formatPrice(product.price)}
                </span>
                <Badge
                  variant={product.stock > 0 ? "default" : "destructive"}
                  className={
                    product.stock > 0
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                      : ""
                  }
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="mt-1 font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stock</p>
                  <p className="mt-1 font-medium">{product.stock} units</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Created</p>
                  <p className="mt-1 font-medium">
                    {new Date(product.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
              <div className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                ID: <span className="font-mono">{product.id}</span>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}