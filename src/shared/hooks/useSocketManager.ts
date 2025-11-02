import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useProgress } from '../context/ProgressContext';

export const useSocketManager = () => {
  const { socket } = useSocket();
  const { dispatch } = useProgress();

  useEffect(() => {
    if (!socket) return;

    const handleFormFillProgress = (data: any) => {
      console.log('[SOCKET MANAGER] Progress update:', data);
      const { reportId, status, message, data: progressData } = data;

      let progress = 0;

      // Calculate progress based on status and data
      if (progressData?.percentage !== undefined) {
        progress = progressData.percentage;
      } else if (progressData?.current && progressData?.total) {
        progress = Math.round((progressData.current / progressData.total) * 100);
      } else {
        switch (status) {
          case 'INITIALIZING':
          case 'FETCHING_RECORD':
            progress = 5;
            break;
          case 'COMPLETE':
            progress = 100;
            break;
        }
      }

      dispatch({
        type: 'UPDATE_PROGRESS',
        payload: {
          reportId,
          updates: {
            status,
            message,
            progress,
            data: progressData
          }
        }
      });
    };

    const handleFormFillComplete = (data: any) => {
      console.log('[SOCKET MANAGER] Form fill complete:', data);
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
      
      const handleCompletion = async () => {
        dispatch({
          type: 'UPDATE_PROGRESS',
          payload: {
            reportId: data.reportId,
            updates: {
              progress: 100,
              message: 'Complete!',
              status: 'COMPLETE'
            }
          }
        });
        
        await delay(2000);
        dispatch({
          type: 'CLEAR_PROGRESS',
          payload: { reportId: data.reportId }
        });
      };
      
      handleCompletion();
    };

    const handleFormFillError = (data: any) => {
      console.error('[SOCKET MANAGER] Form fill error:', data);
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
      
      const handleError = async () => {
        dispatch({
          type: 'UPDATE_PROGRESS',
          payload: {
            reportId: data.reportId,
            updates: {
              message: `Error: ${data.error}`,
              progress: 0,
              status: 'FAILED'
            }
          }
        });
        
        await delay(3000);
        dispatch({
          type: 'CLEAR_PROGRESS',
          payload: { reportId: data.reportId }
        });
      };
      
      handleError();
    };

    const handleFormFillPaused = (data: any) => {
      console.log('[SOCKET MANAGER] Form fill paused:', data);
      dispatch({
        type: 'UPDATE_PROGRESS',
        payload: {
          reportId: data.reportId,
          updates: { paused: true }
        }
      });
    };

    const handleFormFillResumed = (data: any) => {
      console.log('[SOCKET MANAGER] Form fill resumed:', data);
      dispatch({
        type: 'UPDATE_PROGRESS',
        payload: {
          reportId: data.reportId,
          updates: { paused: false }
        }
      });
    };

    const handleFormFillStopped = (data: any) => {
      console.log('[SOCKET MANAGER] Form fill stopped:', data);
      dispatch({
        type: 'CLEAR_PROGRESS',
        payload: { reportId: data.reportId }
      });
    };

    // Register event listeners
    socket.on('form_fill_progress', handleFormFillProgress);
    socket.on('form_fill_complete', handleFormFillComplete);
    socket.on('form_fill_error', handleFormFillError);
    socket.on('form_fill_paused', handleFormFillPaused);
    socket.on('form_fill_resumed', handleFormFillResumed);
    socket.on('form_fill_stopped', handleFormFillStopped);

    // Cleanup: remove listeners when component unmounts
    return () => {
      socket.off('form_fill_progress', handleFormFillProgress);
      socket.off('form_fill_complete', handleFormFillComplete);
      socket.off('form_fill_error', handleFormFillError);
      socket.off('form_fill_paused', handleFormFillPaused);
      socket.off('form_fill_resumed', handleFormFillResumed);
      socket.off('form_fill_stopped', handleFormFillStopped);
    };
  }, [socket, dispatch]);
};