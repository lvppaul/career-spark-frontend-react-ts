import { useCallback, useEffect, useState } from 'react';
import { getRoadmap } from '../services/testRiasecService';
import type { RoadmapResponse, RoadmapUI } from '../types';

export function useRiasecRoadmap(sessionId?: number, userId?: number) {
  const [data, setData] = useState<RoadmapResponse | null>(null);
  const [uiData, setUiData] = useState<RoadmapUI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoadmap = useCallback(async () => {
    if (!sessionId || !userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getRoadmap(sessionId, userId);
      setData(res);

      // Map to UI-friendly shape: ensure roadmaps are ordered by stepOrder
      const mapped: RoadmapUI = {
        careerField: res.careerField,
        paths: (res.paths || []).map((p) => ({
          ...p,
          roadmaps: (p.roadmaps || [])
            .slice()
            .sort((a, b) => a.stepOrder - b.stepOrder),
        })),
      };
      setUiData(mapped);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, userId]);

  useEffect(() => {
    let mounted = true;
    if (!sessionId || !userId) return;
    // only run when mounted
    (async () => {
      if (!mounted) return;
      await fetchRoadmap();
    })();
    return () => {
      mounted = false;
    };
  }, [fetchRoadmap, sessionId, userId]);

  return { data, uiData, isLoading, error, refetch: fetchRoadmap };
}
