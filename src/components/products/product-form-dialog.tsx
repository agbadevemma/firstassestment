"use client"
import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  createProduct,
  updateProduct,
  type Product,
} from "@/lib/products-store";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  price: z.coerce.number().min(0.01, "Price must be greater than 0").max(1000000),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int("Must be an integer").min(0).max(100000),
  description: z.string().trim().min(5, "Description too short").max(1000),
});

type FormValues = z.infer<typeof schema>;

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product?: Product | null;
}) {
  const isEdit = !!product;
  const queryClient = useQueryClient();

const form = useForm<FormValues, any, FormValues>({
   resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      stock: 0,
      description: "",
    },
  });
  

  useEffect(() => {
    if (open) {
      form.reset(
        product
          ? {
              name: product.name,
              price: product.price,
              category: product.category,
              stock: product.stock,
              description: product.description,
            }
          : { name: "", price: 0, category: "", stock: 0, description: "" },
      );
    }
  }, [open, product, form]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (isEdit && product) return updateProduct(product.id, values);
      return createProduct(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(isEdit ? "Product updated" : "Product created");
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the product details below."
              : "Fill in the details to add a new product."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (NGN)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register("price")}
              />
              {form.formState.errors.price && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">Stock quantity</Label>
              <Input id="stock" type="number" {...form.register("stock")} />
              {form.formState.errors.stock && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.stock.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={form.watch("category")}
              onValueChange={(v) =>
                form.setValue("category", v, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-xs text-destructive">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Create product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}