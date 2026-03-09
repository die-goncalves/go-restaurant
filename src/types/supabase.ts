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
      checkout_session: {
        Row: {
          created_at: string
          customer_id: string
          expires_at: string
          id: string
          line_items: Json | null
          payment_intent_id: string | null
          payment_status: string | null
          shipping_options: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          expires_at?: string
          id: string
          line_items?: Json | null
          payment_intent_id?: string | null
          payment_status?: string | null
          shipping_options?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          expires_at?: string
          id?: string
          line_items?: Json | null
          payment_intent_id?: string | null
          payment_status?: string | null
          shipping_options?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'checkout_session_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'stripe_customer'
            referencedColumns: ['stripe_customer_id']
          }
        ]
      }
      food_rating: {
        Row: {
          created_at: string
          customer_id: string
          food_id: string
          rating: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          food_id: string
          rating?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          food_id?: string
          rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'food_rating_food_id_fkey'
            columns: ['food_id']
            isOneToOne: false
            referencedRelation: 'foods'
            referencedColumns: ['id']
          }
        ]
      }
      foods: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string | null
          price: number | null
          restaurant_id: string
          stripe_food_id: string | null
          stripe_price_id: string | null
          tag_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string | null
          price?: number | null
          restaurant_id: string
          stripe_food_id?: string | null
          stripe_price_id?: string | null
          tag_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string | null
          price?: number | null
          restaurant_id?: string
          stripe_food_id?: string | null
          stripe_price_id?: string | null
          tag_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'foods_restaurant_id_fkey'
            columns: ['restaurant_id']
            isOneToOne: false
            referencedRelation: 'restaurants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'foods_tag_id_fkey'
            columns: ['tag_id']
            isOneToOne: false
            referencedRelation: 'tag'
            referencedColumns: ['id']
          }
        ]
      }
      operating_hours: {
        Row: {
          end_hour: string | null
          id: string
          restaurant_id: string
          start_hour: string | null
          weekday: Database['public']['Enums']['weekday_enum'] | null
        }
        Insert: {
          end_hour?: string | null
          id?: string
          restaurant_id: string
          start_hour?: string | null
          weekday?: Database['public']['Enums']['weekday_enum'] | null
        }
        Update: {
          end_hour?: string | null
          id?: string
          restaurant_id?: string
          start_hour?: string | null
          weekday?: Database['public']['Enums']['weekday_enum'] | null
        }
        Relationships: [
          {
            foreignKeyName: 'operating_hours_restaurant_id_fkey'
            columns: ['restaurant_id']
            isOneToOne: false
            referencedRelation: 'restaurants'
            referencedColumns: ['id']
          }
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          coordinates: Json | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string | null
          phone_number: string | null
          place: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string | null
          phone_number?: string | null
          place?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string | null
          phone_number?: string | null
          place?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stripe_customer: {
        Row: {
          customer_id: string
          stripe_customer_id: string
        }
        Insert: {
          customer_id: string
          stripe_customer_id: string
        }
        Update: {
          customer_id?: string
          stripe_customer_id?: string
        }
        Relationships: []
      }
      tag: {
        Row: {
          created_at: string
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      weekday_enum:
        | 'Monday'
        | 'Tuesday'
        | 'Wednesday'
        | 'Thursday'
        | 'Friday'
        | 'Saturday'
        | 'Sunday'
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
      weekday_enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ]
    }
  }
} as const
