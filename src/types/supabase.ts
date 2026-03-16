export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          id: string
          stripe_customer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id: string
          stripe_customer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          stripe_customer_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      operating_hours: {
        Row: {
          end_hour: string
          id: string
          start_hour: string
          store_id: string
          weekday: number | null
        }
        Insert: {
          end_hour: string
          id?: string
          start_hour: string
          store_id: string
          weekday?: number | null
        }
        Update: {
          end_hour?: string
          id?: string
          start_hour?: string
          store_id?: string
          weekday?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'operating_hours_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'store_details_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'operating_hours_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'operating_hours_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores_ratings_summary'
            referencedColumns: ['id']
          }
        ]
      }
      order_products: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price_cents: number
          product_id: string
          quantity: number
          store_id: string
          transfer_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price_cents: number
          product_id: string
          quantity?: number
          store_id: string
          transfer_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price_cents?: number
          product_id?: string
          quantity?: number
          store_id?: string
          transfer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'order_products_order_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_products_product_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_products_store_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'store_details_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_products_store_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_products_store_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores_ratings_summary'
            referencedColumns: ['id']
          }
        ]
      }
      order_transfers: {
        Row: {
          commission_rate: number
          created_at: string
          gross_amount: number
          id: string
          order_id: string
          store_id: string
          stripe_transfer_id: string
          transferred_amount: number
        }
        Insert: {
          commission_rate: number
          created_at?: string
          gross_amount: number
          id?: string
          order_id: string
          store_id: string
          stripe_transfer_id: string
          transferred_amount: number
        }
        Update: {
          commission_rate?: number
          created_at?: string
          gross_amount?: number
          id?: string
          order_id?: string
          store_id?: string
          stripe_transfer_id?: string
          transferred_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: 'order_transfers_order_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_transfers_store_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'store_details_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_transfers_store_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_transfers_store_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores_ratings_summary'
            referencedColumns: ['id']
          }
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string | null
          expires_at: string | null
          id: string
          payment_intent: string | null
          payment_status:
            | Database['public']['Enums']['checkout_payment_status']
            | null
          shipping_address: Json | null
          shipping_amount: number | null
          status: Database['public']['Enums']['checkout_status'] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          expires_at?: string | null
          id: string
          payment_intent?: string | null
          payment_status?:
            | Database['public']['Enums']['checkout_payment_status']
            | null
          shipping_address?: Json | null
          shipping_amount?: number | null
          status?: Database['public']['Enums']['checkout_status'] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          payment_intent?: string | null
          payment_status?:
            | Database['public']['Enums']['checkout_payment_status']
            | null
          shipping_address?: Json | null
          shipping_amount?: number | null
          status?: Database['public']['Enums']['checkout_status'] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      product_ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          order_product_id: string
          product_id: string
          stars: number
          store_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          order_product_id: string
          product_id: string
          stars: number
          store_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          order_product_id?: string
          product_id?: string
          stars?: number
          store_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_ratings_order_product_fkey'
            columns: ['order_product_id']
            isOneToOne: true
            referencedRelation: 'order_products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_ratings_product_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_ratings_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'store_details_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_ratings_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_ratings_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores_ratings_summary'
            referencedColumns: ['id']
          }
        ]
      }
      product_sections: {
        Row: {
          product_id: string
          section_id: string
        }
        Insert: {
          product_id: string
          section_id: string
        }
        Update: {
          product_id?: string
          section_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_sections_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_sections_section_id_fkey'
            columns: ['section_id']
            isOneToOne: false
            referencedRelation: 'sections'
            referencedColumns: ['id']
          }
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price_cents: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price_cents: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price_cents?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      sections: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      session_splits: {
        Row: {
          created_at: string
          session_id: string
          splits: Json
        }
        Insert: {
          created_at?: string
          session_id: string
          splits: Json
        }
        Update: {
          created_at?: string
          session_id?: string
          splits?: Json
        }
        Relationships: []
      }
      store_categories: {
        Row: {
          category_id: string
          store_id: string
        }
        Insert: {
          category_id: string
          store_id: string
        }
        Update: {
          category_id?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'store_categories_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'store_categories_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'store_details_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'store_categories_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'store_categories_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores_ratings_summary'
            referencedColumns: ['id']
          }
        ]
      }
      store_products: {
        Row: {
          is_available: boolean | null
          product_id: string
          stock_quantity: number
          store_id: string
        }
        Insert: {
          is_available?: boolean | null
          product_id: string
          stock_quantity?: number
          store_id: string
        }
        Update: {
          is_available?: boolean | null
          product_id?: string
          stock_quantity?: number
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'store_products_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'store_products_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'store_details_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'store_products_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'store_products_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores_ratings_summary'
            referencedColumns: ['id']
          }
        ]
      }
      stores: {
        Row: {
          address: string | null
          commission_rate: number
          coordinates: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          neighborhood: string | null
          phone_number: string | null
          stripe_account_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          commission_rate?: number
          coordinates?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          neighborhood?: string | null
          phone_number?: string | null
          stripe_account_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          commission_rate?: number
          coordinates?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          neighborhood?: string | null
          phone_number?: string | null
          stripe_account_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      product_ratings_summary: {
        Row: {
          average_rating: number | null
          product_id: string | null
          total_reviews: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'product_ratings_product_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      product_store_ratings_summary: {
        Row: {
          average_rating: number | null
          product_id: string | null
          store_id: string | null
          total_reviews: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'product_ratings_product_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_ratings_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'store_details_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_ratings_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_ratings_store_id_fkey'
            columns: ['store_id']
            isOneToOne: false
            referencedRelation: 'stores_ratings_summary'
            referencedColumns: ['id']
          }
        ]
      }
      store_details_view: {
        Row: {
          address: string | null
          average_rating: number | null
          coordinates: string | null
          description: string | null
          id: string | null
          image_url: string | null
          is_open: boolean | null
          name: string | null
          neighborhood: string | null
          operating_hours: Json | null
          phone_number: string | null
          products: Json | null
          total_reviews: number | null
        }
        Insert: {
          address?: string | null
          average_rating?: never
          coordinates?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          is_open?: never
          name?: string | null
          neighborhood?: string | null
          operating_hours?: never
          phone_number?: string | null
          products?: never
          total_reviews?: never
        }
        Update: {
          address?: string | null
          average_rating?: never
          coordinates?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          is_open?: never
          name?: string | null
          neighborhood?: string | null
          operating_hours?: never
          phone_number?: string | null
          products?: never
          total_reviews?: never
        }
        Relationships: []
      }
      stores_ratings_summary: {
        Row: {
          average_rating: number | null
          categories: string[] | null
          coordinates: string | null
          created_at: string | null
          id: string | null
          image_url: string | null
          name: string | null
          neighborhood: string | null
          total_reviews: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_categories_by_neighborhood: {
        Args: { p_neighborhood: string }
        Returns: {
          id: string
          name: string
        }[]
      }
      unaccent: { Args: { '': string }; Returns: string }
    }
    Enums: {
      checkout_payment_status: 'paid' | 'unpaid' | 'no_payment_required'
      checkout_status: 'open' | 'complete' | 'expired'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {}
  },
  public: {
    Enums: {
      checkout_payment_status: ['paid', 'unpaid', 'no_payment_required'],
      checkout_status: ['open', 'complete', 'expired']
    }
  }
} as const
