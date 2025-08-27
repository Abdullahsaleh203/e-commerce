'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  Star, 
  ShoppingCart, 
  Grid3X3,
  List,
  ChevronDown,
  X,
  Package
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button, Input, Card, Badge } from '@/components/ui';
import { SectionLoading } from '@/components/ui';
import { ProductService } from '@/lib/api';
import { Product, ProductFilters } from '@/types';
import { formatCurrency, debounce } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

const PRODUCTS_PER_PAGE = 12;

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'books', label: 'Books' },
];

const sortOptions = [
  { value: 'created-desc', label: 'Newest First' },
  { value: 'created-asc', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'rating-desc', label: 'Highest Rated' },
];

const ProductCard: React.FC<{ product: Product; viewMode: 'grid' | 'list' }> = ({ 
  product, 
  viewMode 
}) => {
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(product);
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Link href={`/products/${product._id}`}>
          <Card hover className="p-4">
            <div className="flex gap-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
                {product.isFeatured && (
                  <Badge className="absolute -top-1 -right-1" variant="success" size="sm">
                    Featured
                  </Badge>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.ratings) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews})</span>
                  <Badge variant="outline" size="sm">{product.category}</Badge>
                </div>
              </div>
              
              <div className="flex flex-col items-end justify-between">
                <span className="font-bold text-xl text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                
                <Button 
                  size="sm" 
                  onClick={handleAddToCart}
                  loading={isLoading}
                  disabled={isInCart(product._id)}
                >
                  {isInCart(product._id) ? 'In Cart' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/products/${product._id}`}>
        <Card hover className="group overflow-hidden">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product.isFeatured && (
              <Badge className="absolute top-2 left-2" variant="success">
                Featured
              </Badge>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.ratings) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviews})</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-bold text-xl text-gray-900">
                {formatCurrency(product.price)}
              </span>
              
              <Button 
                size="sm" 
                onClick={handleAddToCart}
                loading={isLoading}
                disabled={isInCart(product._id) || product.stock === 0}
              >
                {isInCart(product._id) ? (
                  'In Cart'
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  <><ShoppingCart className="h-4 w-4" /> Add</>\n                )}\n              </Button>\n            </div>\n          </div>\n        </Card>\n      </Link>\n    </motion.div>\n  );\n};\n\nexport default function ProductsPage() {\n  const [products, setProducts] = useState<Product[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');\n  const [showFilters, setShowFilters] = useState(false);\n  const [filters, setFilters] = useState<ProductFilters>({\n    category: '',\n    search: '',\n    minPrice: undefined,\n    maxPrice: undefined,\n    sort: 'created',\n    order: 'desc',\n    page: 1,\n    limit: PRODUCTS_PER_PAGE,\n  });\n  \n  const searchParams = useSearchParams();\n  const router = useRouter();\n\n  // Initialize filters from URL params\n  useEffect(() => {\n    const initialFilters: ProductFilters = {\n      category: searchParams.get('category') || '',\n      search: searchParams.get('search') || '',\n      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,\n      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,\n      sort: (searchParams.get('sort') as any) || 'created',\n      order: (searchParams.get('order') as any) || 'desc',\n      page: Number(searchParams.get('page')) || 1,\n      limit: PRODUCTS_PER_PAGE,\n    };\n    setFilters(initialFilters);\n  }, [searchParams]);\n\n  // Debounced search function\n  const debouncedSearch = useMemo(\n    () => debounce((searchTerm: string) => {\n      updateFilters({ search: searchTerm, page: 1 });\n    }, 500),\n    []\n  );\n\n  const updateFilters = (newFilters: Partial<ProductFilters>) => {\n    const updatedFilters = { ...filters, ...newFilters };\n    setFilters(updatedFilters);\n    \n    // Update URL\n    const params = new URLSearchParams();\n    Object.entries(updatedFilters).forEach(([key, value]) => {\n      if (value !== '' && value !== undefined && value !== null) {\n        params.set(key, String(value));\n      }\n    });\n    \n    router.push(`/products?${params.toString()}`);\n  };\n\n  // Fetch products\n  useEffect(() => {\n    const fetchProducts = async () => {\n      setLoading(true);\n      try {\n        let data: any;\n        \n        if (filters.category) {\n          data = await ProductService.getProductsByCategory(filters.category);\n        } else if (filters.search) {\n          // For now, get all products and filter on frontend\n          // In real implementation, this would be handled by backend search\n          data = await ProductService.getAllProducts();\n        } else {\n          data = await ProductService.getAllProducts();\n        }\n        \n        let filteredProducts = data.products || [];\n        \n        // Apply frontend filtering (in real app, this would be done on backend)\n        if (filters.search) {\n          filteredProducts = filteredProducts.filter((product: Product) =>\n            product.name.toLowerCase().includes(filters.search!.toLowerCase()) ||\n            product.description.toLowerCase().includes(filters.search!.toLowerCase())\n          );\n        }\n        \n        if (filters.minPrice !== undefined) {\n          filteredProducts = filteredProducts.filter((product: Product) => \n            product.price >= filters.minPrice!\n          );\n        }\n        \n        if (filters.maxPrice !== undefined) {\n          filteredProducts = filteredProducts.filter((product: Product) => \n            product.price <= filters.maxPrice!\n          );\n        }\n        \n        // Apply sorting\n        filteredProducts.sort((a: Product, b: Product) => {\n          const sortKey = filters.sort || 'created';\n          const order = filters.order || 'desc';\n          \n          let comparison = 0;\n          \n          switch (sortKey) {\n            case 'price':\n              comparison = a.price - b.price;\n              break;\n            case 'name':\n              comparison = a.name.localeCompare(b.name);\n              break;\n            case 'rating':\n              comparison = a.ratings - b.ratings;\n              break;\n            default: // created\n              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();\n          }\n          \n          return order === 'asc' ? comparison : -comparison;\n        });\n        \n        setProducts(filteredProducts);\n      } catch (error) {\n        console.error('Failed to fetch products:', error);\n        toast.error('Failed to load products');\n      } finally {\n        setLoading(false);\n      }\n    };\n\n    fetchProducts();\n  }, [filters]);\n\n  const clearFilters = () => {\n    setFilters({\n      category: '',\n      search: '',\n      minPrice: undefined,\n      maxPrice: undefined,\n      sort: 'created',\n      order: 'desc',\n      page: 1,\n      limit: PRODUCTS_PER_PAGE,\n    });\n    router.push('/products');\n  };\n\n  const hasActiveFilters = filters.category || filters.search || filters.minPrice || filters.maxPrice;\n\n  return (\n    <Layout>\n      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8\">\n        {/* Header */}\n        <div className=\"mb-8\">\n          <h1 className=\"text-3xl font-bold text-gray-900 mb-4\">Products</h1>\n          \n          {/* Search Bar */}\n          <div className=\"flex flex-col sm:flex-row gap-4 mb-6\">\n            <div className=\"flex-1\">\n              <Input\n                type=\"text\"\n                placeholder=\"Search products...\"\n                value={filters.search}\n                onChange={(e) => {\n                  setFilters(prev => ({ ...prev, search: e.target.value }));\n                  debouncedSearch(e.target.value);\n                }}\n                startIcon={<Search className=\"h-4 w-4\" />}\n              />\n            </div>\n            \n            <div className=\"flex items-center gap-2\">\n              <Button\n                variant=\"outline\"\n                onClick={() => setShowFilters(!showFilters)}\n                className=\"flex items-center gap-2\"\n              >\n                <Filter className=\"h-4 w-4\" />\n                Filters\n                {hasActiveFilters && (\n                  <Badge variant=\"destructive\" size=\"sm\">•</Badge>\n                )}\n              </Button>\n              \n              <div className=\"flex rounded-lg border border-gray-300 overflow-hidden\">\n                <Button\n                  variant={viewMode === 'grid' ? 'default' : 'ghost'}\n                  size=\"sm\"\n                  onClick={() => setViewMode('grid')}\n                  className=\"rounded-none\"\n                >\n                  <Grid3X3 className=\"h-4 w-4\" />\n                </Button>\n                <Button\n                  variant={viewMode === 'list' ? 'default' : 'ghost'}\n                  size=\"sm\"\n                  onClick={() => setViewMode('list')}\n                  className=\"rounded-none\"\n                >\n                  <List className=\"h-4 w-4\" />\n                </Button>\n              </div>\n            </div>\n          </div>\n\n          {/* Filters Panel */}\n          <AnimatePresence>\n            {showFilters && (\n              <motion.div\n                initial={{ opacity: 0, height: 0 }}\n                animate={{ opacity: 1, height: 'auto' }}\n                exit={{ opacity: 0, height: 0 }}\n                className=\"overflow-hidden\"\n              >\n                <Card className=\"p-6 mb-6\">\n                  <div className=\"grid grid-cols-1 md:grid-cols-4 gap-4\">\n                    {/* Category Filter */}\n                    <div>\n                      <label className=\"block text-sm font-medium text-gray-700 mb-2\">\n                        Category\n                      </label>\n                      <select\n                        value={filters.category}\n                        onChange={(e) => updateFilters({ category: e.target.value, page: 1 })}\n                        className=\"w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500\"\n                      >\n                        {categories.map((category) => (\n                          <option key={category.value} value={category.value}>\n                            {category.label}\n                          </option>\n                        ))}\n                      </select>\n                    </div>\n\n                    {/* Price Range */}\n                    <div>\n                      <label className=\"block text-sm font-medium text-gray-700 mb-2\">\n                        Min Price\n                      </label>\n                      <Input\n                        type=\"number\"\n                        placeholder=\"$0\"\n                        value={filters.minPrice || ''}\n                        onChange={(e) => updateFilters({ \n                          minPrice: e.target.value ? Number(e.target.value) : undefined,\n                          page: 1 \n                        })}\n                      />\n                    </div>\n                    \n                    <div>\n                      <label className=\"block text-sm font-medium text-gray-700 mb-2\">\n                        Max Price\n                      </label>\n                      <Input\n                        type=\"number\"\n                        placeholder=\"$1000\"\n                        value={filters.maxPrice || ''}\n                        onChange={(e) => updateFilters({ \n                          maxPrice: e.target.value ? Number(e.target.value) : undefined,\n                          page: 1 \n                        })}\n                      />\n                    </div>\n\n                    {/* Sort */}\n                    <div>\n                      <label className=\"block text-sm font-medium text-gray-700 mb-2\">\n                        Sort By\n                      </label>\n                      <select\n                        value={`${filters.sort}-${filters.order}`}\n                        onChange={(e) => {\n                          const [sort, order] = e.target.value.split('-');\n                          updateFilters({ sort, order, page: 1 });\n                        }}\n                        className=\"w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500\"\n                      >\n                        {sortOptions.map((option) => (\n                          <option key={option.value} value={option.value}>\n                            {option.label}\n                          </option>\n                        ))}\n                      </select>\n                    </div>\n                  </div>\n                  \n                  {hasActiveFilters && (\n                    <div className=\"mt-4 pt-4 border-t border-gray-200\">\n                      <Button\n                        variant=\"outline\"\n                        size=\"sm\"\n                        onClick={clearFilters}\n                        className=\"flex items-center gap-2\"\n                      >\n                        <X className=\"h-4 w-4\" />\n                        Clear All Filters\n                      </Button>\n                    </div>\n                  )}\n                </Card>\n              </motion.div>\n            )}\n          </AnimatePresence>\n\n          {/* Results Info */}\n          <div className=\"flex items-center justify-between mb-6\">\n            <p className=\"text-gray-600\">\n              {loading ? 'Loading...' : `Showing ${products.length} products`}\n            </p>\n          </div>\n        </div>\n\n        {/* Products Grid/List */}\n        {loading ? (\n          <SectionLoading text=\"Loading products...\" />\n        ) : products.length > 0 ? (\n          <motion.div\n            layout\n            className={viewMode === 'grid' \n              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'\n              : 'space-y-4'\n            }\n          >\n            <AnimatePresence mode=\"popLayout\">\n              {products.map((product) => (\n                <ProductCard \n                  key={product._id} \n                  product={product} \n                  viewMode={viewMode}\n                />\n              ))}\n            </AnimatePresence>\n          </motion.div>\n        ) : (\n          <div className=\"text-center py-12\">\n            <Package className=\"h-16 w-16 text-gray-400 mx-auto mb-4\" />\n            <h3 className=\"text-lg font-medium text-gray-900 mb-2\">\n              No products found\n            </h3>\n            <p className=\"text-gray-500 mb-4\">\n              {hasActiveFilters \n                ? 'Try adjusting your filters or search terms'\n                : 'No products are currently available'\n              }\n            </p>\n            {hasActiveFilters && (\n              <Button variant=\"outline\" onClick={clearFilters}>\n                Clear Filters\n              </Button>\n            )}\n          </div>\n        )}\n      </div>\n    </Layout>\n  );\n}"