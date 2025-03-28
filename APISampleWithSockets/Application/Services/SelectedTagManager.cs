using System.Collections.Concurrent;

namespace APISampleWithSockets.Application.Services
{
    public class SelectedTagManager
    {

        private readonly ConcurrentBag<string> _selectedTags = [];

        public void AddTag(string tagName)
        {
            if (!_selectedTags.Contains(tagName))
            {
                _selectedTags.Add(tagName);
            }
        }

        public IReadOnlyCollection<string> GetAllSelectedTags() { 
            return _selectedTags.ToArray();
        }

    }
}
