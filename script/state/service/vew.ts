

export const api_partyGet = async (byId: string): Promise<{ok: boolean, json: () => Promise<any>}> => {
    const response = await fetch(`/api/party/get?id=${byId}`);
    if (!response.ok) {
      console.error('Failed to fetch party data');
      return {ok: false, json: () => Promise.resolve({})};
    }
    return response;
  }