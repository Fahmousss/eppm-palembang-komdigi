import { useEffect, useState } from 'react';
import axiosInstance from '~/config/axiosConfig';
import { useAppData } from '~/context/AppDataContext';

interface UseFetchOptions {
  endpoint: string; // endpoint seperti '/contents/latest', '/complaints/1', dsb
  params?: Record<string, any>; // query parameters opsional
  enabled?: boolean; // untuk kontrol fetch otomatis
}

export function useFetch<T = any>({ endpoint, params = {}, enabled = true }: UseFetchOptions) {
  const { refreshKey } = useAppData();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(endpoint, { params });
        setData(response.data.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(params), refreshKey, enabled]);

  return { data, isLoading, error };
}
