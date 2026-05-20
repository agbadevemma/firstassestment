"use client";
import { useMemo, useState} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PackageX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, listProducts, type Product } from "@/lib/products-store";
import { formatDate, formatPrice } from "@/lib/format";
import dynamic from "next/dynamic";

const ProductFormDialog = dynamic(
  () => import("@/components/products/product-form-dialog"),
  {
    ssr: false,
  },
);

const DeleteProductDialog = dynamic(
  () => import("@/components/products/delete-product-dialog"),
  {
    ssr: false,
  },
);
const ProductDetailsSheet = dynamic(
  () => import("@/components/products/product-details-sheet"),
  {
    ssr: false,
  },
);

const PAGE_SIZE = 10;

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <Badge variant="destructive">Out of Stock</Badge>;
  return (
    <Badge
      variant="secondary"
      className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 "
    >
      In Stock · {stock}
    </Badge>
  );
}

export default function ProductsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (category !== "all" && p.category !== category) return false;
      if (stockFilter === "in" && p.stock <= 0) return false;
      if (stockFilter === "out" && p.stock > 0) return false;
      return true;
    });
  }, [data, search, category, stockFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
            <p className="text-sm text-muted-foreground">
              Manage your catalog, pricing and stock levels.
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products by name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                />
              </div>
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="md:w-44">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={stockFilter}
                onValueChange={(v) => {
                  setStockFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="md:w-44">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any stock</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              {isError && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {(error as Error)?.message ?? "Failed to load products"}{" "}
                  <Button
                    variant="link"
                    className="px-1 text-destructive"
                    onClick={() => refetch()}
                  >
                    Retry
                  </Button>
                </div>
              )}

              {isLoading ? (
                <LoadingState />
              ) : pageItems.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden overflow-hidden rounded-md border md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="w-35 text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pageItems.map((p) => (
                          <TableRow
                            key={p.id}
                            className="cursor-pointer"
                            onClick={() => setViewing(p)}
                          >
                            <TableCell className="font-medium">
                              {p.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{p.category}</Badge>
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {formatPrice(p.price)}
                            </TableCell>
                            <TableCell>
                              <StockBadge stock={p.stock} />
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(p.createdAt)}
                            </TableCell>
                            <TableCell
                              className="text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setViewing(p)}
                                  aria-label="View"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditing(p)}
                                  aria-label="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setDeleting(p)}
                                  aria-label="Delete"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile cards */}
                  <div className="grid gap-3 md:hidden">
                    {pageItems.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                        onClick={() => setViewing(p)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {p.category}
                            </p>
                          </div>
                          <p className="tabular-nums font-semibold">
                            {formatPrice(p.price)}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <StockBadge stock={p.stock} />
                          <div
                            className="flex gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setEditing(p)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setDeleting(p)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing{" "}
                      <span className="font-medium text-foreground">
                        {(currentPage - 1) * PAGE_SIZE + 1}–
                        {Math.min(currentPage * PAGE_SIZE, filtered.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-foreground">
                        {filtered.length}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ProductFormDialog open={addOpen} onOpenChange={setAddOpen} />

      <ProductFormDialog
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        product={editing}
      />

      <DeleteProductDialog
        product={deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
      />

      <ProductDetailsSheet
        product={viewing}
        onOpenChange={(v) => !v && setViewing(null)}
      />
    </>
  );
}

function LoadingState() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-16 text-center">
      <PackageX className="h-10 w-10 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium">No products found</p>
      <p className="text-xs text-muted-foreground">
        Try adjusting your search or filters.
      </p>
    </div>
  );
}
