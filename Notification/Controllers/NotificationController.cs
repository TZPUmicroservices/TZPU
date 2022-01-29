using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Notification.HubConfig;

namespace Notification.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private List<int> studenti;
        private IHubContext<NotificationHub> _hub;
        public NotificationController(IHubContext<NotificationHub> hub)
        {
            _hub = hub;
        }
        
        [HttpGet]
        [Route("Notify")]
        public async Task<IActionResult> Notify(string studenti_index,string text)
        {
            studenti = JsonConvert.DeserializeObject<List<int>>(studenti_index);
            foreach (int index in studenti)
            {
                await _hub.Clients.All.SendAsync(index.ToString(), text);
            }
            return Ok(new { Message = text});
        }
        [HttpGet]
        [Route("Failure")]
        public async Task<IActionResult> Failure(string studenti_index, string text)
        {
            Console.WriteLine(text);
            studenti = JsonConvert.DeserializeObject<List<int>>(studenti_index);
            foreach (int index in studenti)
            {
                await _hub.Clients.All.SendAsync(index.ToString(), text);
            }
            return Ok(new { Message =text });
        }
    }
}
